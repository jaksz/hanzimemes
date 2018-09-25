import React, { Component } from "react";
import {
  Container,
  Hero,
  Title,
  SubTitle,
  Input,
  Level,
  Field,
  Control,
  Button
} from "reactbulma";

import history from "./history";

export default class Header extends Component {
  state = { hanzilist: [], search: "" };

  async componentDidMount() {
    const response = await fetch("/hanzilist");
    const hanzilist = await response.json();

    this.setState({ hanzilist });

    let count = await fetch("/count");
    count = await count.json();

    this.setState({ count });
  }

  search() {
    if (this.state.hanzilist.includes(this.state.search)) {
      history.push(`/hanzi/${this.state.search}`);
      this.setState({});
    } else {
      alert(`${this.state.search} not found!`);
    }
  }

  render() {
    return (
      <div>
        <Container>
          <Level>
            <Level.Left>
              <Level.Item>
                <Hero>
                  <Hero.Body>
                    <Title>Hanzi Memes</Title>
                    <SubTitle>
                      <br />
                      Make learning Chinese characters memorable with memes.{" "}
                      {this.state.count && (
                        <span>
                          <b>{this.state.count}</b>
                           memes generated so far!
                        </span>
                      )}
                    </SubTitle>
                  </Hero.Body>
                </Hero>
              </Level.Item>
            </Level.Left>
            <Level.Right>
              <Level.Item>
                <Field hasAddons>
                  <Control>
                    <Input
                      large
                      success={this.state.hanzilist.includes(this.state.search)}
                      danger={
                        !!this.state.search &&
                        !this.state.hanzilist.includes(this.state.search)
                      }
                      type="text"
                      onChange={e => this.setState({ search: e.target.value })}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.search();
                        }
                      }}
                      style={{ width: "70px" }}
                      placeholder="汉..."
                    />
                  </Control>
                  <Control>
                    <Button large primary onClick={() => this.search()}>
                      Search
                    </Button>
                  </Control>
                </Field>
              </Level.Item>
            </Level.Right>
          </Level>
        </Container>
      </div>
    );
  }
}
