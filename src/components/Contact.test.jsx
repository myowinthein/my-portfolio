import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import Contact from './Contact';

vi.mock('@emailjs/browser', () => ({ default: { sendForm: vi.fn() } }));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

let recaptchaCallbacks;

const installGrecaptcha = () => {
  window.grecaptcha = {
    render: vi.fn((_containerId, options) => {
      recaptchaCallbacks = options;
      return 'widget-1';
    }),
    execute: vi.fn(() => {
      recaptchaCallbacks.callback('fake-token');
    }),
    reset: vi.fn(),
  };
};

const fillForm = async (user) => {
  await user.type(screen.getByPlaceholderText('YOUR NAME'), 'Jane Doe');
  await user.type(screen.getByPlaceholderText('YOUR EMAIL'), 'jane@example.com');
  await user.type(screen.getByPlaceholderText('YOUR SUBJECT'), 'Hello');
  await user.type(screen.getByPlaceholderText('YOUR MESSAGE'), 'Hi there');
};

beforeEach(() => {
  vi.clearAllMocks();
  delete window.grecaptcha;
});

afterEach(() => {
  delete window.grecaptcha;
});

describe('Contact', () => {
  it('renders all required form fields', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('YOUR NAME')).toBeRequired();
    expect(screen.getByPlaceholderText('YOUR EMAIL')).toBeRequired();
    expect(screen.getByPlaceholderText('YOUR SUBJECT')).toBeRequired();
    expect(screen.getByPlaceholderText('YOUR MESSAGE')).toBeRequired();
  });

  it('shows an error if submitted before reCAPTCHA has finished loading', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(toast.error).toHaveBeenCalledWith(
      'reCAPTCHA is still loading. Please try again.',
      expect.anything()
    );
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  it('sends the form via EmailJS once reCAPTCHA succeeds', async () => {
    installGrecaptcha();
    emailjs.sendForm.mockResolvedValueOnce();
    const user = userEvent.setup();
    render(<Contact />);

    await waitFor(() => expect(window.grecaptcha.render).toHaveBeenCalled());
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(window.grecaptcha.execute).toHaveBeenCalledWith('widget-1');
    await waitFor(() => expect(emailjs.sendForm).toHaveBeenCalled());
    expect(emailjs.sendForm.mock.calls[0][0]).toBeTruthy(); // serviceId
    expect(emailjs.sendForm.mock.calls[0][1]).toBeTruthy(); // templateId
    expect(emailjs.sendForm.mock.calls[0][3]).toBeTruthy(); // publicKey

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(
      'Message Sent Successfully!',
      expect.anything()
    ));
    expect(window.grecaptcha.reset).toHaveBeenCalledWith('widget-1');
  });

  it('shows an error toast and resets reCAPTCHA when EmailJS fails', async () => {
    installGrecaptcha();
    emailjs.sendForm.mockRejectedValueOnce(new Error('network error'));
    const user = userEvent.setup();
    render(<Contact />);

    await waitFor(() => expect(window.grecaptcha.render).toHaveBeenCalled());
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
      'Failed to send message!',
      expect.anything()
    ));
    expect(window.grecaptcha.reset).toHaveBeenCalledWith('widget-1');
  });

  it('shows an error toast when reCAPTCHA itself errors', async () => {
    installGrecaptcha();
    const user = userEvent.setup();
    render(<Contact />);

    await waitFor(() => expect(window.grecaptcha.render).toHaveBeenCalled());
    recaptchaCallbacks['error-callback']();

    expect(toast.error).toHaveBeenCalledWith('reCAPTCHA failed. Please try again.', expect.anything());
  });

  it('shows an error toast when reCAPTCHA expires', async () => {
    installGrecaptcha();
    render(<Contact />);

    await waitFor(() => expect(window.grecaptcha.render).toHaveBeenCalled());
    recaptchaCallbacks['expired-callback']();

    expect(toast.error).toHaveBeenCalledWith('reCAPTCHA expired. Please try again.', expect.anything());
  });
});
