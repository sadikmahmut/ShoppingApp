CREATE TABLE IF NOT EXISTS public."Orders"
(
    "Id" uuid NOT NULL,
    "ProductId" uuid,
    "UserId" uuid,
    "Date" date,
    "Status" character varying COLLATE pg_catalog."default",
    CONSTRAINT "Orders_pkey" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Products"
(
    "Id" uuid NOT NULL,
    "Name" character varying COLLATE pg_catalog."default",
    "Price" double precision,
    "Description" character varying COLLATE pg_catalog."default",
    "Active" boolean,
    "CreatedDate" date,
    "CreatedBy" uuid,
    "ModifiedDate" date,
    "ModifiedBy" uuid,
    "DeletedDate" date,
    "DeletedBy" uuid,
    CONSTRAINT "Products_pkey" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Users"
(
    "Id" uuid NOT NULL,
    "Username" character varying COLLATE pg_catalog."default",
    "Email" character varying COLLATE pg_catalog."default",
    "PasswordHash" character varying COLLATE pg_catalog."default",
    "FirstName" character varying COLLATE pg_catalog."default",
    "LastName" character varying COLLATE pg_catalog."default",
    "Phone" character varying COLLATE pg_catalog."default",
    "Address" character varying COLLATE pg_catalog."default",
    "Active" boolean,
    "CreatedDate" date,
    "CreatedBy" uuid,
    "ModifiedDate" date,
    "ModifiedBy" uuid,
    "DeletedDate" date,
    "DeletedBy" uuid,
    "Role" character varying COLLATE pg_catalog."default",
    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);
