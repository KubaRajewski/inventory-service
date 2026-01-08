create table if not exists product (
                                       id bigserial primary key,
                                       sku varchar(64) not null unique,
    name varchar(256) not null,
    unit varchar(32) not null,
    category varchar(64),
    supplier varchar(128),
    min_total integer not null default 0 check (min_total >= 0),
    unit_cost numeric(12,2) not null default 0,
    active boolean not null default true
    );

create table if not exists stock (
                                     product_id bigint not null references product(id) on delete cascade,
    location varchar(32) not null,
    quantity integer not null default 0 check (quantity >= 0),
    version integer not null default 0,
    primary key (product_id, location)
    );

create table if not exists movement (
                                        id bigserial primary key,
                                        type varchar(32) not null,
    product_id bigint not null references product(id),
    from_location varchar(32),
    to_location varchar(32),
    quantity integer not null check (quantity > 0),
    occurred_at timestamptz not null default now(),
    source varchar(128) not null default 'manual',
    note varchar(256)
    );

create table if not exists sales_import (
                                            id bigserial primary key,
                                            file_name varchar(255) not null,
    sha256 varchar(64) not null unique,
    status varchar(32) not null,
    total_lines integer not null default 0,
    processed_skus integer not null default 0,
    movements_created integer not null default 0,
    created_at timestamptz not null default now()
    );
