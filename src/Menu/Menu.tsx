import * as React from 'react'
import { Grid, Tooltip } from '@material-ui/core';
import GridOn from '@material-ui/icons/GridOn';
import Translate from '@material-ui/icons/Translate';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

const appStyles = StyleSheet.create({
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
    <Grid item={true}>
      <Tooltip title="Led Panel" enterDelay={500} placement={'right'}>
        <Link to={'/'}>
          <GridOn  className={css(appStyles.icon)} />
        </Link>
      </Tooltip>
      <Tooltip title="Alphabet" enterDelay={500} placement={'right'}>
        <Link to={'/alphabet'}>
          <Translate  className={css(appStyles.icon)} />
        </Link>
      </Tooltip>
    </Grid>
  )
}

export default Menu;



