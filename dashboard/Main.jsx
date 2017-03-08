import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import Drawer from 'material-ui/Drawer'

import injectTapEventPlugin from 'react-tap-event-plugin';

class AppWrapper extends React.Component {
  constructor(props) {
    injectTapEventPlugin();
    super(props)
  }
  render(){
    return (
      <MuiThemeProvider>
        { this.props.children }
      </MuiThemeProvider>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
    }
  }
  render() {
    return (
      <AppWrapper>
        <div>
          <AppBar title="Koa2/React-Materoail Boilerplate" onLeftIconButtonTouchTap={() => this.setState({ drawerOpen: true})}/>
          <Drawer docked={false} open={this.state.drawerOpen} onRequestChange={() => this.setState({ drawerOpen: false })}>
            <IconButton><NavigationClose onTouchTap={() => this.setState({ drawerOpen: false})}/></IconButton>
          </Drawer>
        </div>
      </AppWrapper>
    )
  }
}

render(
  <Main />,
  document.getElementById('app')
)
