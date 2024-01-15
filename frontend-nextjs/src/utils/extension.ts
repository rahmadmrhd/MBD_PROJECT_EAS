export function isNullOrWhitespace(input: string | null | undefined) {
  if (typeof input === "undefined" || input == null) return true;

  return input.replace(/\s/g, "").length < 1;
}

export const UserAgent = Object.freeze({
  Mobile: Symbol(0),
  Tablet: Symbol(1),
  Dekstop: Symbol(2),
});
export const getScreenSize = () => {
  if (typeof window !== "undefined") {
    const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    const height = window.innerHeight > 0 ? window.innerHeight : screen.height;
    return { width, height };
  }
};

export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return UserAgent.Tablet;
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return UserAgent.Mobile;
  }
  return UserAgent.Dekstop;
};
