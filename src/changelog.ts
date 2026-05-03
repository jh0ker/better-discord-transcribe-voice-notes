import type { ChangelogModalOptions } from 'betterdiscord/ui';

export const CHANGELOG: Record<
  string,
  Pick<ChangelogModalOptions,'blurb' | 'changes'>
> = {
  '0.1.5': {
    blurb: 'New Discord, new problems',
    changes: [
      {
        type: 'fixed',
        title: 'Fixed',
        items: [
          'The plugin works again',
          'Button style while transcribing fixed',
        ],
      },
      {
        type: 'changed',
        title: 'Internal',
        items: ['Update build system'],
      },
    ],
  },
};
