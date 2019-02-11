import * as React from "react";
import Box from "./GridBox";
import posed from "react-pose";

const containerStyle = {
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center"
};

const gridStyle = {
  display: "grid",
  width: "100%",
  gridColumnGap: 5,
  gridRowGap: 5,
  padding: 20
};

const masonryStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  marginLeft: -2
};
const masonryValues = ["410px", "283px", "175px", "175px", "283px", "410px"];

const Container = posed.div({
  default: {
    scale: 0.8,
    opacity: 0,
    background: "transparent",
    borderRadius: 4
  },
  hidden: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 1
    }
  },
  touched: {
    opacity: 1,
    scale: 1,
    transition: {
      scale: ({ numberOfBoxes }) => ({
        ease: [0.175, 0.885, 0.32, 1.1],
        duration: 300 - numberOfBoxes
      }),
      opacity: ({ numberOfBoxes }) => ({
        ease: "easeOut",
        duration: 700 - numberOfBoxes
      })
    }
  },
  impacted: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: ({ d, numberOfBoxes }) => ({
        ease: [0.175, 0.885, 0.32, 1.1],
        duration: 300 - numberOfBoxes,
        delay: d * (150 - numberOfBoxes / 1.5)  
      }),
      opacity: ({ d, numberOfBoxes }) => ({
        ease: "easeOut",
        duration: 700 - numberOfBoxes,
        delay: d * (150 - numberOfBoxes / 1.5)
      })
    }
  },
  props: { d: 0 }
});

interface State {
  touched: number;
  boxes: any;
  layout: string;
  masonryHeight: number;
  gridTemplateColumns: string;
}

export class Grid extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      touched: -1,
      boxes: [...Array(9)].map(x => 0), // Set the number of boxes
      layout: "grid",
      masonryHeight: 255,
      gridTemplateColumns: "repeat(3, 1fr)"
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleClick(null, 0);
    }, 200);
  }

  calculateImpactRadiation(index) {
    const positions = [...document.querySelectorAll(".Grid__box")].map(el => {
      const loc = el.getBoundingClientRect();
      return {
        x: loc.left + loc.width / 2,
        y: loc.top + loc.height / 2,
        width: loc.width
      };
    });

    return positions
      .map(pos => {
        return Math.sqrt(
          Math.pow(positions[index].x - pos.x, 2) +
            Math.pow(positions[index].y - pos.y, 2)
        );
      })
      .map(d => d / positions[index].width);
  }

  handleClick(e, index) {
    this.setState({ touched: index }, () => {
      this.setState({ boxes: this.calculateImpactRadiation(index) });
    });
  }

  renderChildren() {
    const { touched, boxes, layout, masonryHeight } = this.state;

    return this.state.boxes.map((distanceFromImpact, index) => {
      return (
        <Container
          pose={
            distanceFromImpact
              ? "impacted"
              : touched === index
              ? "touched"
              : "hidden"
          }
          d={distanceFromImpact}
          key={`container${index}`}
          numberOfBoxes={boxes.length}
        >
          <Box
            onClick={e => this.handleClick(e, index)}
            key={`box${index}`}
            layout={layout}
            masonryWidth={masonryValues[index % 6]}
            masonryHeight={masonryHeight}
          />
        </Container>
      );
    });
  }

  render() {
    const { layout, gridTemplateColumns } = this.state;

    return (
      <div style={containerStyle}>
        <div
          className="Grid"
          style={
            layout === "grid"
              ? { ...gridStyle, gridTemplateColumns }
              : masonryStyle
          }
        >
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}
