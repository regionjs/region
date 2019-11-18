type Flag = boolean;

const createSwitchIdFlag = () => {
  let switchIdFlag: Flag = false;
  const getSwitchIdFlag = () => switchIdFlag;
  const setSwitchIdFlag = (value: Flag) => {
    switchIdFlag = value;
  };
  return { getSwitchIdFlag, setSwitchIdFlag };
};

const createAcceptLatestFlag = () => {
  let acceptLatestFlag: Flag = false;
  const getAcceptLatestFlag = () => acceptLatestFlag;
  const setAcceptLatestFlag = (value: Flag) => {
    acceptLatestFlag = value;
  };
  return { getAcceptLatestFlag, setAcceptLatestFlag };
};

export const { getSwitchIdFlag, setSwitchIdFlag } = createSwitchIdFlag();

export const { getAcceptLatestFlag, setAcceptLatestFlag } = createAcceptLatestFlag();
