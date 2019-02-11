import * as React from "react";

const allImages = [582, 696, 1003, 913, 827, 1040, 1038, 360];

const gridBoxStyle = {
  background: `url('https://picsum.photos/800/800?image=${allImages[1]}') no-repeat center center`,
  backgroundSize: "100%",
  display: "flex",
  flexBasis: 1,
  width: "100%",
  height: 0,
  paddingTop: "100%",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 2,
  overflow: "hidden"
};

const masonryBoxStyle = {
  background: `url('https://picsum.photos/800/800?image=${allImages[1]}') no-repeat center center`,
  backgroundSize: "cover",
  flex: "auto",
  borderRadius: 2,
  margin: 2
};

interface Props {
  layout: string;
  masonryWidth: string;
  masonryHeight: number;
  onClick(event: any): void;
}

export default class Box extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { layout, masonryWidth, masonryHeight } = this.props;

    return (
      <div
        className="Grid__box"
        style={
          layout === "grid"
            ? gridBoxStyle
            : { ...masonryBoxStyle, width: masonryWidth, height: masonryHeight }
        }
        onClick={e => {
          this.props.onClick(e);
        }}
      />
    );
  }
}
