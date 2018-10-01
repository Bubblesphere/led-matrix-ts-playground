import * as React from 'react';
import { ReactNode } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  centeredVertical: {
    alignSelf: 'center'
  }
});

interface ProfileFormItemProps {
  name: string,
  children: ReactNode,
  css?: object
}

const ProfileFormItem = (props: ProfileFormItemProps) => {
  return (
    <Grid container={true}>
      <Grid item={true} xs={6} className={css(styles.centeredVertical, props.css)}>
        <Typography gutterBottom={true}>{props.name}</Typography>
      </Grid>
      <Grid item={true} xs={6}>
        {props.children}
      </Grid>
    </Grid>
  );
}

export default ProfileFormItem