import React from 'react';
import { Badge, Container, Text, Grid, Row, Col } from 'native-base';

export default class TestMenuColorCode extends React.Component {
  render() {
    return (
      <Container
        style={{
          paddingTop: '5%',
          paddingLeft: '5%',
          backgroundColor: '#D3D3D3'
        }}
      >
        <Grid>
          <Row>
            <Col
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Badge primary>
                <Text>1</Text>
              </Badge>
              <Text style={{ color: 'black' }}> Unvisited</Text>
            </Col>
            <Col
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Badge success>
                <Text>1</Text>
              </Badge>
              <Text style={{ color: 'black' }}> Answered</Text>
            </Col>
          </Row>
          <Row style={{ paddingTop: '2%' }}>
            <Col
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Badge>
                <Text>1</Text>
              </Badge>
              <Text style={{ color: 'black' }}> Skipped</Text>
            </Col>
            <Col
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Badge warning>
                <Text>1</Text>
              </Badge>
              <Text style={{ color: 'black' }}> Current</Text>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}
