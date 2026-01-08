-- V2__seed.sql

insert into product (sku, name, unit, min_total, active)
values
    ('SKU-0001','Rice 1kg','pcs',20,true),
    ('SKU-0002','Pasta 500g','pcs',30,true),
    ('SKU-0003','Tomato sauce 400g','pcs',25,true),
    ('SKU-0004','Olive oil 1L','pcs',10,true),
    ('SKU-0005','Sugar 1kg','pcs',20,true),
    ('SKU-0006','Flour 1kg','pcs',25,true),
    ('SKU-0007','Coffee 250g','pcs',15,true),
    ('SKU-0008','Tea 100 bags','pcs',15,true),
    ('SKU-0009','Milk 1L','pcs',40,true),
    ('SKU-0010','Butter 200g','pcs',20,true),
    ('SKU-0011','Cheese 300g','pcs',12,true),
    ('SKU-0012','Apples 1kg','pcs',25,true),
    ('SKU-0013','Bananas 1kg','pcs',20,true),
    ('SKU-0014','Water 1.5L','pcs',60,true),
    ('SKU-0015','Sparkling water 1.5L','pcs',40,true)
    on conflict (sku) do nothing;

insert into stock (product_id, location, quantity)
select p.id, 'BACKROOM', 0 from product p
    on conflict (product_id, location) do nothing;

insert into stock (product_id, location, quantity)
select p.id, 'SHOPFLOOR', 0 from product p
    on conflict (product_id, location) do nothing;

update stock s
set quantity = case
                   when s.location = 'BACKROOM' then (10 + (s.product_id % 20))::int
  else (5 + (s.product_id % 10))::int
end,
updated_at = now();

insert into movement (product_id, type, from_location, to_location, quantity, note)
select p.id, 'RECEIPT', null, 'BACKROOM', 10, 'Seed receipt'
from product p
where p.sku in ('SKU-0001','SKU-0002','SKU-0003');

insert into movement (product_id, type, from_location, to_location, quantity, note)
select p.id, 'TRANSFER', 'BACKROOM', 'SHOPFLOOR', 3, 'Seed transfer'
from product p
where p.sku in ('SKU-0001','SKU-0002');

insert into movement (product_id, type, from_location, to_location, quantity, note)
select p.id, 'ISSUE', 'SHOPFLOOR', null, 2, 'Seed issue'
from product p
where p.sku in ('SKU-0002','SKU-0003');
