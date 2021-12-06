import './App.css';

import { Layout, Menu, Row, Col } from 'antd';
import "antd/dist/antd.css";

import ContractSetup from './components/contractSetup';
import ContractCode from './components/smartContract';

import { BrowserRouter as Router, Link, Route, Switch, Redirect } from "react-router-dom";

const { Header, Content, Footer } = Layout;
function App() {

  return (
    <Router>
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <Menu theme="dark" mode="horizontal" >
            {/* Logo? */}
            <Menu.Item key="1">
              Home<Link to="/" />
            </Menu.Item>
            <Menu.Item key="2">
              Smart Contract<Link to="code" />
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ marginTop: "6rem" }}>
          <Row justify="center">
            <Col span={12}>
              <Switch>
                <Route exact path="/" component={ContractSetup} />
                <Route exact path="/code" component={ContractCode} />
                <Redirect to="/" />
              </Switch>
            </Col>
          </Row>
        </Content>

        <Footer  style={{marginTop: "48px" }}>Disclaimer: This is just a fun project that I wanted to do. Please don't use this for anything that is actually super duper serious. I am not responsible on how this is used</Footer>
      </Layout>
    </Router>
  );
}

export default App;
