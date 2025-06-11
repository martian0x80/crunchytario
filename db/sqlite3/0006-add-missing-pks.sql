-- Add missing primary key to domain IdPs. One does not simply add a primary key in SQLite...
alter table cm_domains_idps rename to _cm_domains_idps;
create table cm_domains_idps (
    domain_id  uuid        not null, -- Reference to the domain
    fed_idp_id varchar(32) not null, -- Reference to the identity provider (the set of available IDs is defined in the backend)
    -- Constraints
    primary key (domain_id, fed_idp_id),
    constraint fk_domains_idps_domain_id foreign key (domain_id) references cm_domains(id) on delete cascade
);
insert into cm_domains_idps(domain_id, fed_idp_id)
    select domain_id, fed_idp_id from _cm_domains_idps;
drop table _cm_domains_idps;

-- Add missing primary key to domain extensions
alter table cm_domains_extensions rename to _cm_domains_extensions;
create table cm_domains_extensions (
    domain_id    uuid                     not null, -- Reference to the domain
    extension_id varchar(32)              not null, -- Extension ID (the set of available IDs is defined in the backend)
    config       varchar(4096) default '' not null, -- Extension configuration parameters
    -- Constraints
    primary key (domain_id, extension_id),
    constraint fk_domains_extensions_domain_id foreign key (domain_id) references cm_domains(id) on delete cascade
);
insert into cm_domains_extensions(domain_id, extension_id, config)
    select domain_id, extension_id, config from _cm_domains_extensions;
drop table _cm_domains_extensions;
