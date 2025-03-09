import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./index";

/**
 * A correctly typed `useDispatch` hook specific to my app.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * A correctly typed `useSelector` hook specific to my app.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
