declare module 'demutx' {
  namespace demutx {
    function enhancer(...rest: any[]); 
    function metaReducer(...rest: any[]);
    function push(...rest: any[]);
    function lens_(...rest: any[]);
    function set_(...rest: any[]);
    function over_(...rest: any[]);
    function view_(...rest: any[]);
    function createMutation(...rest: any[]);
    function set_a(...rest: any[]);
    function over_a(...rest: any[]);
    function remove_a(...rest: any[]);
    function push_a(...rest: any[]);
    function filterVal_a(...rest: any[]);
    function toggle_a(...rest: any[]);
  }

  export = demutx
}
