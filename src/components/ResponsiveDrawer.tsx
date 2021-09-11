import { useState } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import VideocamIcon from '@material-ui/icons/Videocam'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Route, Link, useLocation, useHistory } from 'react-router-dom'
import {
  Tooltip,
  ListItemSecondaryAction,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ChatIcon from '@material-ui/icons/Chat'
import DeleteIcon from '@material-ui/icons/Delete'

import Channel from './Channel'
import Profile from './Profile'
import AddChannel from './AddChannel'
import AuthLoading from './AuthLoading'
import InviteMeetng from './InviteMeeting'

import useIsOnline from '../hooks/useIsOnline'
import useChannelList from '../hooks/useChannelList'
import useCurrentChannel from '../hooks/useCurrentChannel'
import useCurrentUser from '../hooks/useCurrentUser'

import { firebaseApp } from '../firebaseConfig'
import { getFirestore, doc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { User } from 'firebase/auth'
const db = getFirestore(firebaseApp)

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
}))

interface Props {
  window: Window
}

function ResponsiveDrawer(props: Props): JSX.Element {
  const { window } = props
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [oepnDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openInviteDialog, setOpenInvitedialog] = useState(false)

  const isOnline = useIsOnline()
  const channelList = useChannelList()
  const location = useLocation()
  const currentChannel = useCurrentChannel()
  const user = useCurrentUser()
  // console.log(user)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleShowInviteMeeting = () => {
    setOpenInvitedialog(true)
  }

  const handleInviteMeetingCancel = () => {
    setOpenInvitedialog(false)
  }

  const handleInviteMeetingOK = (message: string) => {
    console.log(message)
    if (currentChannel && user && message) {
      sendJoinMeeting(currentChannel, user, message).catch(console.log)
      setOpenInvitedialog(false)
    }
  }

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleClickOkDeleteDialog = () => {
    setOpenDeleteDialog(false)
    if (currentChannel) {
      deleteChannel(currentChannel).catch(console.log)
    }
  }

  const handleClickCanelDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const isLocationChannel = () => {
    if (location.pathname.indexOf('/channel/') === 0) {
      return location.pathname.substring('/channel/'.length).length > 0 ? true : false
    }
    return false
  }

  const isOnwerChannel = () => {
    if (location.pathname.indexOf('/channel/') === 0) {
      const channelID = location.pathname.substring('/channel/'.length)
      // console.log(channelID)
      // console.log(user && user.uid)
      // console.log(channelList)
      const channel = channelList.filter((channel: Channel) => channel.id === channelID && channel.owner === user?.uid)
      // console.log(channel)
      if (channel.length > 0) return true
    }
    return false
  }

  const isCurrentPath = (channel: string) => {
    return location.pathname === channel
  }

  const sendJoinMeeting = async (channel: string, user: User, message: string) => {
    const post = {
      owner: user.uid,
      from: user.displayName,
      body: message,
      createdAt: serverTimestamp(),
      metadata: {
        meeting: {
          url: `https://yorifuji.github.io/seaside/?welcomeDialog=false#mesh-${new MediaStream().id}`,
        },
      },
    }
    await addDoc(collection(db, 'channels', channel, 'posts'), post)
  }

  const deleteChannel = async (id: string) => {
    await deleteDoc(doc(db, 'channels', id))
  }

  const getChannelTitle = () => {
    let title = 'Channel'
    channelList.forEach((channel: Channel) => {
      if (channel.id === currentChannel) title = `#${channel.name}`
    })
    return title
  }

  // const users = ["yorifuji", "foo", "bar"]

  const drawer = (
    <div>
      {/* <div className={classes.toolbar} />
      <Divider /> */}
      <List>
        <ListItem button component={Link} to='/profile' selected={isCurrentPath('/profile')}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary='Profile' />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary='Channel' />
          <ListItemSecondaryAction>
            <IconButton onClick={() => history.push('/addChannel')}>{isOnline && <AddIcon />}</IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {channelList.map((channel: Channel) => (
          <ListItem
            button
            key={channel.id}
            className={classes.nested}
            component={Link}
            to={`/channel/${channel.id}`}
            selected={isCurrentPath(`/channel/${channel.id}`)}
          >
            <ListItemText primary={`# ${channel.name}`} />
          </ListItem>
        ))}
        {/* <ListItem>
          <ListItemText primary="User" />
        </ListItem>
        {users.map((text, index) => (
          <ListItem button key={text} className={classes.nested} component={Link} to={"/user/" + text}>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
      </List>
    </div>
  )

  const container = window !== undefined ? () => window.document.body : undefined

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap className={classes.title}>
            {location.pathname === '/profile'
              ? 'Profile'
              : location.pathname === '/auth'
              ? 'Loading'
              : location.pathname === '/addChannel'
              ? 'Add Channel'
              : location.pathname.indexOf('/channel') === 0
              ? getChannelTitle()
              : 'Workspace'}
          </Typography>
          {isOnline && isLocationChannel() && (
            <Tooltip title='Video Chat' aria-label='Video Chat'>
              <IconButton aria-label='video chat' color='inherit' onClick={handleShowInviteMeeting}>
                <VideocamIcon />
              </IconButton>
            </Tooltip>
          )}
          {isOnline && isLocationChannel() && isOnwerChannel() && (
            <Tooltip title='Delete This Channel' aria-label='delete channel'>
              <IconButton aria-label='delete channel' color='inherit' onClick={handleClickOpenDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='workspace'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route exact path='/' component={Index} />
        <Route exact path='/auth' component={AuthLoading} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/addChannel' component={AddChannel} />
        <Route path='/channel/:channel' component={Channel} />
        {/* <Route path='/user/:uid' component={User} /> */}
      </main>
      <Dialog
        open={oepnDeleteDialog}
        // onClose={handleClickCanelDeleteDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Delete Channel</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete this channel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCanelDeleteDialog} variant='contained' autoFocus>
            Cancel
          </Button>
          <Button onClick={handleClickOkDeleteDialog} variant='contained' color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {openInviteDialog && (
        <InviteMeetng onCancel={() => handleInviteMeetingCancel()} onOK={(message: string) => handleInviteMeetingOK(message)} />
      )}
    </div>
  )
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}

export default ResponsiveDrawer

const Index = () => {
  return <div></div>
}
