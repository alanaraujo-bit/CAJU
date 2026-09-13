-- A connection is a removable device session, not the owner of chat history.
-- Keep tenant_id intact: only the optional connection reference is detached.
ALTER TABLE conversations ALTER COLUMN whatsapp_connection_id DROP NOT NULL;
ALTER TABLE messages ALTER COLUMN whatsapp_connection_id DROP NOT NULL;

ALTER TABLE conversations
  DROP CONSTRAINT conversations_tenant_id_whatsapp_connection_id_fkey,
  ADD CONSTRAINT conversations_tenant_id_whatsapp_connection_id_fkey
    FOREIGN KEY (tenant_id, whatsapp_connection_id)
    REFERENCES whatsapp_connections(tenant_id, id)
    ON DELETE SET NULL (whatsapp_connection_id);

ALTER TABLE messages
  DROP CONSTRAINT messages_tenant_id_whatsapp_connection_id_fkey,
  ADD CONSTRAINT messages_tenant_id_whatsapp_connection_id_fkey
    FOREIGN KEY (tenant_id, whatsapp_connection_id)
    REFERENCES whatsapp_connections(tenant_id, id)
    ON DELETE SET NULL (whatsapp_connection_id);
