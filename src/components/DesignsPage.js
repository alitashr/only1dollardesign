import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import DesignsFilter from "./DesignsFilter";
import DesignCategory from "./DesignCategory";
import DesignsList from "./DesignsList";
import Pagenav from "./Pagenav";
import FullDesign from "../components/FullDesign/index";

import { DesignContext, WholeContext } from "../App";
import { useParams} from "react-router-dom";
import AppNewProvider from "../api/appProvider";
let APIdomain = AppNewProvider.domain;
const DesignsPage = (props) => {
  const checkoutContext = useContext(WholeContext);
  const designContext = useContext(DesignContext);
  let selectDesign = designContext.selectDesign;
  const params = useParams();
  // if (params && params.designname) {
  //   console.log("DesignsPage -> params", params.designname);
  // }

  let selectedDesign = checkoutContext.state.selectedDesign;

  useEffect(() => {
    const designList = checkoutContext.state.designList;
    if (!designList.length) return;
    if (!params.designname) return;
    const urlDesignname = params.designname.replace(":", "");
    const initdesign = designList.filter((design) => design.Name.toLowerCase() === urlDesignname.toLowerCase());
    if (initdesign) {
      AppNewProvider.fetchDesignThumbNails({ designsFullPathlist: [initdesign[0].FullPath] }).then(
        (selectedDesignThumbInfo) => {
          if (selectedDesignThumbInfo && selectedDesignThumbInfo.length) {
            const selectedFile = selectedDesignThumbInfo[0];
            checkoutContext.dispatch({ type: "set_BusySignal", payload: true });
            const Name = selectedFile.Name;
            const thumb = `${APIdomain}${selectedFile.Thumb}`;
            const props = selectedFile.Props;
            selectDesign(Name, thumb, props);
          }
        }
      );
    }
  }, [checkoutContext.state.designList]);

  return (
    <div>
      <Container style={{ marginTop: 40 }}>
        <Row>
          <Col xs={8}>
            <DesignsFilter />
          </Col>
          <Col>
            <DesignCategory />
          </Col>
        </Row>
        <DesignsList />
        <Pagenav />
        {selectedDesign !== "" ? <FullDesign /> : null}
      </Container>
    </div>
  );
};

export default DesignsPage;
