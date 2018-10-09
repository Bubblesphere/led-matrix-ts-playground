import * as React from 'react'
import { Grid, Tooltip } from '@material-ui/core';
import GridOn from '@material-ui/icons/GridOn';
import Translate from '@material-ui/icons/Translate';
import { StyleSheet, css } from 'aphrodite';

const appStyles = StyleSheet.create({
  menu: {
    background: '#444',
    flex: '0 0 64px',
    color: '#bbb',

  },
  icon: {
    fontSize: 32,
    marginBottom: '16px',
    ':hover': {
      color: 'white',
      cursor: 'pointer'
    }
  },
});

interface MenuProps {
};

const Menu: React.SFC<MenuProps> = (props) => {
  return (
    <Grid container={true} item={true} justify={"center"}  className={css(appStyles.menu)}>
      <Grid item={true}>
        <Tooltip title="Led Panel" enterDelay={500} placement={'right'}>
          <GridOn  className={css(appStyles.icon)} />
        </Tooltip>
        <Tooltip title="Alphabet" enterDelay={500} placement={'right'}>
          <Translate  className={css(appStyles.icon)} />
        </Tooltip>
      </Grid>
    </Grid>
  )
}

export default Menu;