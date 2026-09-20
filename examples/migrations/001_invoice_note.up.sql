-- Fictional example. Apply only to a disposable demonstration database.
create table if not exists demo_invoice_notes (id bigint generated always as identity primary key, note text not null);
