import React from "react";

const TokenForm = ({transferToken}) => {
  return(
    <div className="token-box">
      <form>
        <div className="user-box">
          <input type="text" name="" required="" />
          <label>ETH Address</label>
        </div>
        <a href="#" onClick={transferToken}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Claim Token
        </a>
      </form>
    </div>
)
}

export default TokenForm