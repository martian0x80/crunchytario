------------------------------------------------------------------------------------------------------------------------
-- Add missing primary/unique constraints
------------------------------------------------------------------------------------------------------------------------

alter table cm_domains_idps       add primary key (domain_id, fed_idp_id);
alter table cm_domains_extensions add primary key (domain_id, extension_id);
