import * as types from '../../action-types';
import { getUsage as initialState } from '../initialStates';

const getUsage = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case types.GET_USAGE_START:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_USAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccessful: true,
        data: payload,
      };
    case types.GET_USAGE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case types.GET_USAGE_CLEANUP:
      return {
        ...state,
        error: null,
        isLoading: false,
        isSuccessful: false,
      };
    default:
      return state;
  }
};

export default getUsage;
