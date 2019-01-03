class Region {
  constructor() {
    this.reducerPath = null;
    this.enableLog = true;
    this.expiredTime = 0;
    this.strictLoading = true;
    this.silentConnect = false;
    this.SET_LOADING = '@region/SET_LOADING';
    this.SET_RESULT = '@region/SET_RESULT';
  }
}

export default Region;
