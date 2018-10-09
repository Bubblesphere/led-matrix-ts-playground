import * as React from 'react'
import { Grid, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import Profile, {ProfileProps} from './Profile/Profile';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  configuration: {
    //flex: 1,
    background: '#e7e7e7',
    maxHeight: '100vh',
    overflowY: "auto"
    //borderRight: '1px solid #bbb',
  }
});

const themeDependantStyles = ({spacing}: Theme) => createStyles({
});

interface ConfigurationSectionProps {
    profile: ProfileProps,
};

const ConfigurationSection: React.SFC<ConfigurationSectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
      <Grid item container md={3} className={css(styles.configuration)}>
          <Profile {...props.profile} />
      </Grid>
  )
}

export default withStyles(themeDependantStyles)(ConfigurationSection);