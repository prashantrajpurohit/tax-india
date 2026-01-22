import { AbilityBuilder, createMongoAbility } from "@casl/ability";
const ROLES = ["admin", "retailor", "distributor"];
export const defineRulesFor = (role: string, options?: string[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  if (ROLES.includes(role)) {
    can("manage", "all");
  } else if (role == "staff") {
    if (options) {
      can("read", [...options]);
    }
  } else {
    can("read", "all");
  }
  return build();
};
