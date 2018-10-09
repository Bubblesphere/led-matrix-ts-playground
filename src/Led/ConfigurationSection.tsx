import * as React from 'react'
import { Grid, Theme, createStyles } from '@material-ui/core';
import Profile, {ProfileProps} from './Profile/Profile';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  configuration: {
    flex: 1,
    background: '#f1f1f1',
    borderRight: '1px solid #bbb',
    padding: '48px'
  }
});

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  root: {
    fontSize: typography.fontSize * 3,
    marginBottom: spacing.unit * 4,
    paddingRight: spacing.unit * 10
  },
  icons: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  },
  pauseResumeButton: {
    fontSize: typography.fontSize * 4
  }
});

interface ConfigurationSectionProps {
    profile: ProfileProps,
};

const ConfigurationSection: React.SFC<ConfigurationSectionProps> = (props) => {
  return (
      <Grid item={true} container={true} className={css(styles.configuration)}>
          <h1>Test</h1>
          <Profile {...props.profile} />
      </Grid>
  )
}

export default ConfigurationSection;