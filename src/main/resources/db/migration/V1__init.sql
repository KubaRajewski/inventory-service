-- V1__init.sql

create table if not exists product (
                                       id           bigserial primary key,
                                       sku          varchar(64) not null unique,
    name         varchar(255) not null,
    unit         varchar(32) not null default 'pcs',
    min_total    integer not null default 0,
    active       boolean not null default true,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
    );

create table if not exists stock (
                                     product_id   bigint not null references product(id) on delete restrict,
    location     varchar(16) not null,
    quantity     integer not null default 0,
    updated_at   timestamptz not null default now(),
    primary key (product_id, location),
    constraint stock_location_chk check (location in ('BACKROOM', 'SHOPFLOOR')),
    constraint stock_quantity_chk check (quantity >= 0)
    );

create table if not exists sales_import (
                                            id                bigserial primary key,
                                            sha256            char(64) not null unique,
    original_filename varchar(255),
    status            varchar(32) not null,
    total_lines       integer not null default 0,
    processed_lines   integer not null default 0,
    created_at        timestamptz not null default now()
    );

create table if not exists movement (
                                        id              bigserial primary key,
                                        product_id      bigint not null references product(id) on delete restrict,
    type            varchar(16) not null,
    from_location   varchar(16),
    to_location     varchar(16),
    quantity        integer not null,
    occurred_at     timestamptz not null default now(),
    note            varchar(500),
    sales_import_id bigint references sales_import(id) on delete set null,
    constraint movement_type_chk check (type in ('RECEIPT','ISSUE','TRANSFER','SALE_IMPORT')),
    constraint movement_quantity_chk check (quantity > 0),
    constraint movement_from_loc_chk check (from_location is null or from_location in ('BACKROOM','SHOPFLOOR')),
    constraint movement_to_loc_chk check (to_location is null or to_location in ('BACKROOM','SHOPFLOOR'))
    );

create index if not exists idx_movement_product_occurred_at on movement(product_id, occurred_at desc);
create index if not exists idx_movement_sales_import_id on movement(sales_import_id);
