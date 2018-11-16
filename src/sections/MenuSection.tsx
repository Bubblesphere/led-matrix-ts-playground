import * as React from 'react'
import { Grid, Tooltip, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import GridOn from '@material-ui/icons/GridOn';
import Translate from '@material-ui/icons/Translate';
import { StyleSheet, css } from 'aphrodite';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

const themeDependantStyles = ({spacing, palette}: Theme) => {
  const activeBorderHeight = spacing.unit / 2;

  return createStyles({
    gridMenu: {
      paddingLeft: spacing.unit * 4
    },
    gridLink: {
      marginRight: spacing.unit * 4,
      borderTop: `${activeBorderHeight}px solid transparent`,
      '&:hover': {
        borderTop: `${activeBorderHeight}px solid ${palette.primary.main}`
      }
    },
    active: {
      borderTop: `${activeBorderHeight}px solid white`
    },
    link: {
      color: 'rgb(240, 240, 240)',
      textDecoration: 'none',
      '&:hover': {
        color:  palette.primary.main
      },
      outline: 'none'
    },
    icon: {
      fontSize: 32,
      padding: spacing.unit
    }
  });
}

interface MenuProps {
};

const Menu: React.SFC<MenuProps & WithStyles<typeof themeDependantStyles> & RouteComponentProps> = (props) => {
  const gridLinkPanelClasses = props.location.pathname == '/' ? 
    [props.classes.gridLink, props.classes.active].join(' ') :
    props.classes.gridLink;

  const gridLinkAlphabetClasses = props.location.pathname == '/alphabet' ? 
    [props.classes.gridLink, props.classes.active].join(' ') :
    props.classes.gridLink;

  return (
    <Grid container item justify="flex-start" className={props.classes.gridMenu}>

      <Grid item className={gridLinkPanelClasses}>
        <Tooltip title="View LED Panel" enterDelay={500} placement={'bottom'}>
          <Link to={'/'} className={props.classes.link}>
            <Grid container item justify="center" alignItems="center" style={{height: '100%'}}>
              <GridOn className={props.classes.icon} />
              Panel
            </Grid>
          </Link>
        </Tooltip>
      </Grid>

      <Grid item className={gridLinkAlphabetClasses}>
        <Tooltip title="Create / Edit / Delete Characters From Your Alphabet" enterDelay={500} placement={'bottom'}>
          <Link to={'/alphabet'} className={props.classes.link}>
            <Grid container item justify="center" alignItems="center" style={{height: '100%'}}>
              <Translate  className={props.classes.icon} />
              Alphabet
            </Grid>
          </Link>
        </Tooltip>
      </Grid>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(withRouter(Menu));



