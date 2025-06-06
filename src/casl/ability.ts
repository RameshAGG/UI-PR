import { AbilityBuilder, PureAbility, Subject } from '@casl/ability';
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type AppAbility = PureAbility<[Actions, Subject]>;

export const defineAbilityFor = (permissions: Array<{ action: string; subject: string }>) => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

  // Default rules - deny everything by default
  cannot('manage', 'all');
  
  // Add permissions from the array
  permissions?.forEach((permission) => {
    const { action, subject } = permission;
    if (action && subject) {
      can(action.toLowerCase() as Actions, subject);
    }
  });

  return build();
};