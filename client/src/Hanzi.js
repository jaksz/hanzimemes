import React, { Component } from "react";
import {
  Title,
  SubTitle,
  Level,
  Heading,
  Button,
  Message,
  Delete
} from "reactbulma";
import { Row, Col } from "react-flexbox-grid";
import { Selector } from "react-giphy-selector";
import { GridLoader } from "react-spinners";
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
let stopword = require("stopword");

const { COLORS, IDEOGRAPHICS } = require("./constants");

export default class Hanzi extends Component {
  state = {
    hanzi: {
      character: "",
      pinyin: [],
      definition: "",
      decomposition: "",
      etymology: { hint: "" },
      layout: "⿱",
      color: "",
      generating: false,
      generated: undefined
    },

    selected: {}
  };

  async componentDidMount() {
    const response = await fetch(`/hanzi-api/${this.props.match.params.hanzi}`);
    const hanzi = await response.json();
    hanzi.layout = hanzi.layout || this.getLayout(hanzi);
    hanzi.color = hanzi.color || this.getColor(hanzi);
    hanzi.keywords = stopword.removeStopwords(hanzi.etymology.hint.split(" "));
    hanzi.parts = [
      ...hanzi.decomposition,
      hanzi.character,
      hanzi.etymology.phonetic,
      hanzi.etymology.semantic,
      hanzi.radical
    ]
      .filter(e => e && !Object.keys(IDEOGRAPHICS).includes(e))
      .filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
      })
      .filter(e => e !== hanzi.character);

    hanzi.suggestions = [...hanzi.keywords];
    await Promise.all(
      hanzi.parts.map(async part => {
        const response = await fetch(`/hanzi-api/${part}`);
        this.setState({ [part]: await response.json() });
        hanzi.parts
          .map(part => this.state[part] && this.state[part].definition)
          .filter(e => e)
          .map(e =>
            stopword.removeStopwords(e.split(" ")).map(e => {
              return hanzi.suggestions.push(e);
            })
          );
      })
    );
    hanzi.suggestions = hanzi.suggestions.filter(function(item, i, ar) {
      return ar.indexOf(item) === i;
    });

    this.setState({ hanzi });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && nextProps.match.params.hanzi !== this.state.hanzi) {
      this.setState({
        hanzi: {
          character: "",
          pinyin: [],
          definition: "",
          decomposition: "",
          etymology: { hint: "" },
          layout: "⿱",
          color: "",
          generating: false,
          generated: undefined
        },

        selected: {}
      });
      this.componentDidMount();
    }
  }

  getLayout(hanzi) {
    return hanzi.decomposition
      .split("")
      .find(char => Object.keys(IDEOGRAPHICS).includes(char));
  }

  getColor(hanzi) {
    let reading = hanzi.pinyin[0];
    let escaped = entities.encodeNonUTF(reading);
    if (escaped.includes("amacr")) {
      return COLORS[1];
    }
    if (escaped.includes("acute")) {
      return COLORS[2];
    }
    if (escaped.includes("caron")) {
      return COLORS[3];
    }
    if (escaped.includes("grave")) {
      return COLORS[4];
    }
  }

  render() {
    let { hanzi } = this.state;

    return (
      <div>
        <Level>
          <Level.Item hasTextCentered>
            <div>
              <Heading>Reading</Heading>
              <Title style={{ color: hanzi.color }}>{hanzi.pinyin}</Title>
            </div>
          </Level.Item>
          <Level.Item hasTextCentered>
            <div>
              <Heading>Layout</Heading>
              <Title>{this.getLayout(hanzi)}</Title>
            </div>
          </Level.Item>
          <Level.Item hasTextCentered>
            <div>
              <Heading>Definition</Heading>
              <Title style={{ fontSize: "120%" }}>{hanzi.definition}</Title>
            </div>
          </Level.Item>

          {hanzi.etymology.type === "ideographic" && (
            <Level.Item hasTextCentered>
              <div>
                <Heading>Description</Heading>
                <Title style={{ fontSize: "120%" }}>
                  {hanzi.etymology.hint}
                </Title>
              </div>
            </Level.Item>
          )}

          {hanzi.etymology.type === "pictophonetic" && (
            <Level.Item hasTextCentered>
              <div>
                <Heading>Meaning Part</Heading>
                <Title>
                  {hanzi.etymology.semantic}{" "}
                  <span style={{ fontSize: "50%" }}>
                    {hanzi.etymology.hint}
                  </span>
                </Title>
              </div>
            </Level.Item>
          )}

          {hanzi.etymology.type === "pictophonetic" && (
            <Level.Item hasTextCentered>
              <div>
                <Heading>Sound Part</Heading>
                <Title>{hanzi.etymology.phonetic}</Title>
              </div>
            </Level.Item>
          )}
        </Level>

        <Level>
          <Level.Left>
            <Level.Item>Manually choose layout:</Level.Item>

            <Level.Item>
              {Object.keys(IDEOGRAPHICS).map(key => (
                <Button
                  outlined
                  onClick={() =>
                    this.setState({
                      hanzi: { ...hanzi, selected: undefined, layout: key }
                    })
                  }
                  primary={hanzi.layout === key}
                >
                  {key}
                </Button>
              ))}
            </Level.Item>
          </Level.Left>
        </Level>

        <Row>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Title
              style={{
                fontSize: "1000%",
                textAlign: "center",
                align: "center",
                color: hanzi.color
              }}
            >
              {hanzi.character}
            </Title>

            <br />

            <SubTitle>Parts</SubTitle>

            {hanzi.parts &&
              hanzi.parts.map(part => (
                <div key={part}>
                  {this.state[part] && (
                    <span>
                      <b>{this.state[part].character}</b>{" "}
                      {this.state[part].definition}
                    </span>
                  )}
                </div>
              ))}
          </Col>
          <Col xs={12} sm={12} md={9} lg={9}>
            {this.state.generated ? (
              <img role="presentation" src={`/gif/${this.state.generated}`} />
            ) : this.state.generating ? (
              <span>
                <GridLoader size={100} color={"hsl(171, 100%, 41%)"} />
                <br />
                <span style={{ fontSize: "150%" }}>
                  Generating... <b>this may take up to 30 seconds!</b>
                </span>
              </span>
            ) : (
              IDEOGRAPHICS[hanzi.layout] &&
              IDEOGRAPHICS[hanzi.layout].components.map(
                component =>
                  this.state.selected && this.state.selected[component] ? (
                    <span key={component}>
                      <Message success>
                        <Message.Header>
                          <p>
                            Image for position <b>{component}</b> selected.
                          </p>
                          <Delete
                            onClick={() => {
                              this.setState({
                                selected: {
                                  ...this.state.selected,
                                  [component]: undefined
                                }
                              });
                            }}
                          />
                        </Message.Header>
                        <Message.Body>
                          <img
                            role="presentation"
                            style={{ maxHeight: "300px", maxWidth: "300px" }}
                            src={
                              this.state.selected[component].images.downsized
                                .gif_url
                            }
                          />
                        </Message.Body>
                      </Message>
                      <br />
                      <br />
                    </span>
                  ) : (
                    <span key={component}>
                      <Message warning>
                        <Message.Header>
                          <p>
                            Select image for position <b>{component}</b> by
                            typing or clicking on a suggestion...
                          </p>
                        </Message.Header>
                        <Message.Body>
                          <Selector
                            apiKey={process.env.REACT_APP_GIPHY_API_KEY}
                            searchResultsStyle={{ height: "1000px" }}
                            suggestions={hanzi.suggestions}
                            onGifSelected={async gif => {
                              await this.setState({
                                selected: {
                                  ...this.state.selected,
                                  [component]: gif
                                }
                              });

                              if (
                                IDEOGRAPHICS[hanzi.layout] &&
                                Object.keys(this.state.selected) &&
                                IDEOGRAPHICS[hanzi.layout].components.length ===
                                  Object.keys(this.state.selected).length
                              ) {
                                this.setState({ generating: true });
                                const response = await fetch("/generate/", {
                                  method: "POST",
                                  headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify({
                                    hanzi: hanzi,
                                    width: IDEOGRAPHICS[hanzi.layout].width,
                                    height: IDEOGRAPHICS[hanzi.layout].height,
                                    components: Object.keys(
                                      this.state.selected
                                    ).map(key => ({
                                      class: key,
                                      img: this.state.selected[key]
                                    }))
                                  })
                                });

                                let json = await response.json();
                                this.setState({ generated: json });
                              }
                            }}
                          />
                        </Message.Body>
                      </Message>
                      <br />
                      <br />
                    </span>
                  )
              )
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
