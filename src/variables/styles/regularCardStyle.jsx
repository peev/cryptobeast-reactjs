// ##############################
// // // RegularCard styles
// #############################

import {
  card,
  cardHeader,
  defaultFont,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  defaultCardHeader,
  
} from "variables/styles";

const regularCardStyle = {
  card,
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardHeader: {
    ...cardHeader,
    ...defaultFont
  },
  cardPlainHeader: {
    marginLeft: 0,
    marginRight: 0
  },
  defaultCardHeader,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  cardTitle: {
    color: "#FFFFFF",
    marginTop: "0",
    marginBottom: "5px",
    ...defaultFont,
    fontSize: "1.125em"
  },
  cardSubtitle: {
    ...defaultFont,
    marginBottom: "0",
    color: "rgba(255, 255, 255, 0.62)",
    margin: "0 0 10px"
  },
  cardActions: {
    padding: "14px",
    display: "block",
    height: "auto"
  }
};

export default regularCardStyle;
