import { colors } from './colors'

export const Tabs = {
  variants: {
    main: ({ colorMode }: { colorMode: string }) => ({
      tablist: {
        borderBottom: '1px',
        borderColor: colorMode === 'dark' ? colors.icGray4 : colors.icGray1,
        color: colorMode === 'dark' ? colors.icWhite : colors.icBlack,
        fontSize: '16px',
        fontWeight: '500',
        height: '45px',
        outline: '0',
      },
      tab: {
        _selected: {
          color: colors.icBlue,
          fontWeight: '700',
        },
      },
    }),
    unstyled: ({ colorMode }: { colorMode: string }) => ({
      tablist: {
        backgroundColor:
          colorMode === 'dark' ? colors.icGray4 : colors.icBlue10,
        borderRadius: '8px',
        color: colorMode === 'dark' ? colors.icWhite : colors.black,
        fontSize: '16px',
        fontWeight: '500',
        height: '45px',
        outline: '0',
      },
      tab: {
        _selected: {
          backgroundColor: colorMode === 'dark' ? 'white' : colors.icBlue,
          borderRadius: '8px',
          color: colorMode === 'dark' ? colors.black : colors.icWhite,
        },
      },
    }),
  },
}
