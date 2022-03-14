import styled from "styled-components";

const Button = styled.button`
  /* background: #128ae7; */
  background-color: ${(props) => (props.disabled ? "#333" : "#128ae7")};
  border: 1px solid #979797;
  border-radius: 3px;
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0.24px;
  width: 240px;
  height: 60px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s;
  :hover {
    /* background: #1661d3; */
    background-color: ${(props) => (props.disabled ? "#333" : "#1661d3")};
  }
`;

export default Button;
