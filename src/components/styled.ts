import styled from 'styled-components';
import { darken, lighten, readableColor } from 'polished';
import { GRAY } from '../constants';

export const Base = styled.div`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: currentColor;
  }

  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 1rem;

  button {
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 1rem;
  }

  p {
    margin: 0;
  }
`;

export const DatePickerShadow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
`;

export const DatePickerContainer = styled.div<{ bgColor: string }>`
  min-width: 280px;
  width: 340px;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  background-color: ${props => props.bgColor};
`;

export const DatePickerHeader = styled.div<{ color: string }>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: ${props => props.color};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderText = styled.span<{ bgColor: string }>`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  flex-grow: 1;
  font-size: 1.25rem;
  line-height: 2rem;
  color: ${props => props.bgColor};
`;

export const HeaderButton = styled.button<{ color: string; bgColor: string }>`
  margin-left: 0.5rem;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: ${props => props.bgColor};
  background-color: transparent;

  &:hover {
    background-color: ${props => lighten(0.1, props.color)};
  }
  &:focus {
    background-color: ${props => darken(0.1, props.color)};
  }
`;

export const DatePickerFooter = styled.div`
  padding: 0 1rem 1rem 1rem;
  display: flex;
`;

export const DatePickerCalendar = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

export const CalendarHeader = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
`;

export const CalendarHeaderText = styled.span<{ color: string }>`
  margin-left: auto;
  margin-right: auto;
  height: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: ${props => props.color};
`;

export const CalendarBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CalendarButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  border-radius: 9999px;
`;

interface DynamicButtonProps {
  color: string;
  bgColor: string;
  isActiveMonth: boolean;
  isSelectedDay: boolean;
  isCurrentDay: boolean;
}

export const DynamicButton = styled(CalendarButton)<DynamicButtonProps>`
  pointer-events: ${props => (!props.isActiveMonth ? 'none' : 'auto')};
  color: ${props => {
    if (!props.isActiveMonth) {
      return readableColor(props.bgColor) === '#000' ? GRAY[300] : GRAY[600];
    }

    if (props.isSelectedDay) return props.bgColor;
    if (props.isCurrentDay) return props.color;

    return readableColor(props.bgColor) === '#000' ? GRAY[900] : '#fff';
  }};

  background-color: ${props => {
    if (props.isActiveMonth && props.isSelectedDay) {
      return props.color;
    }

    return 'transparent';
  }};

  &:hover {
    background-color: ${props => {
      if (props.isActiveMonth) {
        if (props.isSelectedDay) {
          return props.color;
        }

        return readableColor(props.bgColor) === '#000' ? GRAY[200] : GRAY[800];
      }

      return 'transparent';
    }};
  }
`;

export const CalendarButtonText = styled.span`
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1rem;
`;

export const FooterButton = styled.button<{ color: string }>`
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  height: 1.5rem;
  font-weight: 600;
  color: ${props => props.color};
  background-color: transparent;

  &:hover {
    color: ${props => lighten(0.1, props.color)};
  }
  &:focus {
    color: ${props => darken(0.1, props.color)};
  }
`;
