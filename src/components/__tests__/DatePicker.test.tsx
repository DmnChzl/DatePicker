import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DatePicker, { RenderProps } from '../DatePicker';

describe('<DatePicker />', () => {
  beforeEach(() => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en');
  });

  test("Should 'Cancel' text be in the document", () => {
    render(
      <div className="flex">
        <DatePicker>
          {(props: RenderProps) => (
            <input
              ref={props.ref}
              placeholder="DatePicker"
              onClick={e => {
                e.preventDefault();
                props.onOpen();
              }}
            />
          )}
        </DatePicker>
      </div>
    );

    const input = screen.getByPlaceholderText('DatePicker');
    fireEvent.click(input);
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
  });

  test("Should 'Annuler' text be in the document", () => {
    render(
      <div className="flex">
        <DatePicker forceLocale="fr">
          {(props: RenderProps) => (
            <input
              ref={props.ref}
              placeholder="DatePicker"
              onClick={e => {
                e.preventDefault();
                props.onOpen();
              }}
            />
          )}
        </DatePicker>
      </div>
    );

    const input = screen.getByPlaceholderText('DatePicker');
    fireEvent.click(input);
    expect(screen.queryByText('Annuler')).toBeInTheDocument();
  });

  test("Shouldn't 'Cancel' text be in the document", () => {
    render(
      <div className="flex">
        <DatePicker hideFooter>
          {(props: RenderProps) => (
            <input
              ref={props.ref}
              placeholder="DatePicker"
              onClick={e => {
                e.preventDefault();
                props.onOpen();
              }}
            />
          )}
        </DatePicker>
      </div>
    );

    const input = screen.getByPlaceholderText('DatePicker');
    fireEvent.click(input);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test("Should 'Nope' text be in the document", () => {
    render(
      <div className="flex">
        <DatePicker customMessages={{ 'Footer.Cancel': 'Nope' }}>
          {(props: RenderProps) => (
            <input
              ref={props.ref}
              placeholder="DatePicker"
              onClick={e => {
                e.preventDefault();
                props.onOpen();
              }}
            />
          )}
        </DatePicker>
      </div>
    );

    const input = screen.getByPlaceholderText('DatePicker');
    fireEvent.click(input);
    expect(screen.queryByText('Nope')).toBeInTheDocument();
  });
});
