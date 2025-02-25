import StakeBottom from "./StakeBottom";
import StakeTopDesktop from "./StakeTopDesktop";
import StakeTopMobile from "./StakeTopMobile";

const Stake = () => {

  return (
    <div className="p-6 flex flex-col gap-4">
      <StakeTopDesktop />
      <StakeTopMobile />
      <StakeBottom />
    </div>
  );
};

export default Stake;
