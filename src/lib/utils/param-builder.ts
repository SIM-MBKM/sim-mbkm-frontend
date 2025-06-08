/**
 * Utility functions for building URL query parameters
 */

export type ParamsObject = Record<string, string | number | boolean | undefined | null>;

/**
 * Checks if a value should be included in the query parameters
 */
const isValidParamValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
};

/**
 * Builds URL query parameters from an object
 * Automatically filters out null, undefined, and empty string values
 */
export const buildParams = (params: ParamsObject): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (isValidParamValue(value)) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

/**
 * Builds pagination parameters
 */
export const buildPaginationParams = (page: number, perPage: number): ParamsObject => {
  return {
    page,
    per_page: perPage,
  };
};

/**
 * Combines multiple parameter objects and builds the query string
 */
export const buildCombinedParams = (...paramObjects: ParamsObject[]): string => {
  const combined = paramObjects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
  return buildParams(combined);
};

/**
 * Specific builder for user filters with pagination
 */
export const buildUserParams = (page: number, perPage: number, filters: Record<string, any> = {}): string => {
  return buildCombinedParams(buildPaginationParams(page, perPage), filters);
};

/**
 * Generic builder for any filtered list with pagination
 */
export const buildFilteredListParams = <T extends Record<string, any>>(
  page: number,
  perPage: number,
  filters: T
): string => {
  return buildCombinedParams(buildPaginationParams(page, perPage), filters);
};
