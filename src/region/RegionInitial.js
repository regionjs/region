class Region {
  constructor() {
    this.store = null;
    this.reducerPath = null;
    this.enableLog = true;
    this.expiredTime = 5 * 60 * 1000;
    this.strictLoading = true;
    this.silentConnect = false;
  }
}

export default Region;
