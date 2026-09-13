import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("falha na recuperação oferece nova tentativa antes de aceitar dados", async ({ page }, info) => {
  let unavailable = true;
  await page.route("**/api/auth/capabilities", route => route.fulfill({
    status: unavailable ? 503 : 200,
    json: unavailable ? { message: "Não foi possível verificar a recuperação. Tente novamente." } : { passwordRecovery: true },
  }));
  await page.goto("/recuperar");
  await expect(page.getByRole("alert")).toContainText("Não foi possível verificar");
  await expect(page.getByRole("button", { name: "Enviar link de recuperação" })).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: `.impeccable/review/access-error-${info.project.name}.png`, fullPage: true });
  unavailable = false;
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByLabel("E-mail", { exact: true })).toBeVisible();
});

test("sucesso da recuperação não substitui o formulário de login", async ({ page }) => {
  await page.route("**/api/auth/capabilities", route => route.fulfill({ json: { passwordRecovery: true } }));
  await page.route("**/api/auth/forgot", route => route.fulfill({ json: { ok: true } }));
  await page.goto("/recuperar");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.test");
  await page.getByRole("button", { name: "Enviar link de recuperação" }).click();
  await expect(page.getByRole("heading", { name: "Confira sua caixa de entrada" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para entrar" }).click();
  await expect(page.getByRole("button", { name: "Entrar no Caju" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Confira sua caixa de entrada" })).toHaveCount(0);
});

test("links incompletos mostram recuperação e não pedem senha", async ({ page }, info) => {
  await page.goto("/redefinir");
  await expect(page.getByRole("alert")).toContainText("Este link está incompleto");
  await expect(page.getByLabel("Nova senha")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Solicitar novo link" })).toHaveAttribute("href", "/recuperar");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: `.impeccable/review/access-link-${info.project.name}.png`, fullPage: true });
  await page.goto("/convite");
  await expect(page.getByRole("alert")).toContainText("Abra o link completo");
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toHaveCount(0);
});

test("senha volta a ficar oculta ao mudar de tela", async ({ page }) => {
  await page.goto("/entrar");
  await page.getByRole("button", { name: "Mostrar senha" }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("link", { name: "Criar sua conta" }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute("type", "password");
});
