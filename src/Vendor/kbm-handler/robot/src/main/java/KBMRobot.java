import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.StringBuilder;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.ArrayList;

import org.jnativehook.GlobalScreen;
import org.jnativehook.NativeHookException;
import org.jnativehook.mouse.NativeMouseEvent;
import org.jnativehook.mouse.NativeMouseInputListener;
import org.jnativehook.keyboard.NativeKeyEvent;
import org.jnativehook.keyboard.NativeKeyListener;

/* http://roufid.com/3-ways-to-add-local-jar-to-maven-project/ */
/* https://github.com/repeats/SimpleNativeHooks */

public class KBMRobot {
	public static void main(String[] args) {
		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

		Robot r = null;
		try {
			r = new Robot();
			// Registering native hooks
			try {
				Logger logger = Logger.getLogger(GlobalScreen.class.getPackage().getName());
				logger.setLevel(Level.WARNING);
				GlobalScreen.registerNativeHook();
			}
			catch (NativeHookException ex) {
				System.err.println("There was a problem registering the native hook.");
				System.err.println(ex.getMessage());

				System.exit(1);
			}

			System.out.println("Creating listeners");
			// Add the appropriate listeners.
			GlobalScreen.addNativeMouseListener(new KBMMouseListener());
			GlobalScreen.addNativeKeyListener(new KBMKeyboardListener());
		} catch (AWTException e1) {
			System.out.println("Failed to create robot.");
			e1.printStackTrace();
			System.exit(1);
		}

		// Make a key string to key id map
		Map<String, Object> map = new HashMap<String, Object>();
		for (Field f : KeyEvent.class.getDeclaredFields()) {
			try {
				if (java.lang.reflect.Modifier.isStatic(f.getModifiers())) {
					f.setAccessible(true);
					map.put(f.getName(), f.get(null));
				}
			} catch (Exception ex) {
				System.out.println("Failed to map key.");
			}
		}
		
		System.out.println("Starting the loop!!");
		while (true) {
			try {
				String str = in.readLine();
				// System.out.println(str);

				if (str != null) {
					String[] stringParts = str.split(" ");
					if (stringParts.length > 1) {
						if (stringParts[0].equalsIgnoreCase("MM") || stringParts[0].equalsIgnoreCase("MOUSEMOVE")) {
							r.mouseMove(Integer.parseInt(stringParts[1]), Integer.parseInt(stringParts[2]));
						} else if (stringParts[0].equalsIgnoreCase("MP") || stringParts[0].equalsIgnoreCase("MD")
								|| stringParts[0].equalsIgnoreCase("MOUSEPRESS")) {
							int press = 0;
							press |= stringParts[1].indexOf("1") > -1 ? KeyEvent.BUTTON1_MASK : 0;
							press |= stringParts[1].indexOf("2") > -1 ? KeyEvent.BUTTON2_MASK : 0;
							press |= stringParts[1].indexOf("3") > -1 ? KeyEvent.BUTTON3_MASK : 0;
							r.mousePress(press);
						} else if (stringParts[0].equalsIgnoreCase("MR") || stringParts[0].equalsIgnoreCase("MU")
								|| stringParts[0].equalsIgnoreCase("MOUSERELEASE")) {
							int press = 0;
							press |= stringParts[1].indexOf("1") > -1 ? KeyEvent.BUTTON1_MASK : 0;
							press |= stringParts[1].indexOf("2") > -1 ? KeyEvent.BUTTON2_MASK : 0;
							press |= stringParts[1].indexOf("3") > -1 ? KeyEvent.BUTTON3_MASK : 0;
							r.mouseRelease(press);
						} else if (stringParts[0].equalsIgnoreCase("MW") || stringParts[0].equalsIgnoreCase("MOUSEWHEEL")) {
							r.mouseWheel(Integer.parseInt(stringParts[1]));
						} else {
							Object key = map.get(stringParts[1]);
							if (key != null) {
								if (stringParts[0].equalsIgnoreCase("D") || stringParts[0].equalsIgnoreCase("P")
										|| stringParts[0].equalsIgnoreCase("PRESS")) {
									System.out.println("Press " + stringParts[1]);

									r.keyPress((Integer) key);
								} else if (stringParts[0].equalsIgnoreCase("U") || stringParts[0].equalsIgnoreCase("R")
										|| stringParts[0].equalsIgnoreCase("RELEASE")) {
									System.out.println("Release " + stringParts[1]);
									r.keyRelease((Integer) key);
								}
							} else {
								if (checkForMediaKeys(stringParts[1])) {
									if (stringParts[0].equalsIgnoreCase("D") || stringParts[0].equalsIgnoreCase("P")
											|| stringParts[0].equalsIgnoreCase("PRESS")) {
										System.out.print("Press " + stringParts[1]);

										callNativeKey(true, stringParts[1]);
									} else if (stringParts[0].equalsIgnoreCase("U") || stringParts[0].equalsIgnoreCase("R")
											|| stringParts[0].equalsIgnoreCase("RELEASE")) {
										System.out.print("Release " + stringParts[1]);
										callNativeKey(false, stringParts[1]);
										
									}
								}
							}
						}
					}
				}
			} catch (Exception e) {
				System.out.println("Something bad happened: " + e.toString());
				e.printStackTrace();
			}
		}
	}

	private static boolean checkForMediaKeys(String key) {
		if ("VOLUME_MUTE".equalsIgnoreCase(key) ||
				"VOLUME_DOWN".equalsIgnoreCase(key) || 
				"VOLUME_UP".equalsIgnoreCase(key) || 
				"MEDIA_PLAY_PAUSE".equalsIgnoreCase(key) || 
				"MEDIA_STOP".equalsIgnoreCase(key) || 
				"MEDIA_PREV_TRACK".equalsIgnoreCase(key) || 
				"MEDIA_NEXT_TRACK".equalsIgnoreCase(key)) {
			
			return true;
		}
		return false;

	}
	
	private static void callNativeKey(boolean pressed, String key) {
		int rawCode = 0;
		int keyCode = 0;
		if ("VOLUME_MUTE".equalsIgnoreCase(key)) {
			rawCode = 0xAD;
			keyCode = NativeKeyEvent.VC_VOLUME_MUTE;
		} else if ("VOLUME_DOWN".equalsIgnoreCase(key)) {
			rawCode = 0xAE;
			keyCode = NativeKeyEvent.VC_VOLUME_DOWN;
		} else if ("VOLUME_UP".equalsIgnoreCase(key)) {
			rawCode = 0xAF;
			keyCode = NativeKeyEvent.VC_VOLUME_UP;
		} else if ("MEDIA_PLAY_PAUSE".equalsIgnoreCase(key)) {
			rawCode = 0xB3;
			keyCode = NativeKeyEvent.VC_MEDIA_PLAY;
		} else if ("MEDIA_STOP".equalsIgnoreCase(key)) {
			rawCode = 0xB2;
			keyCode = NativeKeyEvent.VC_MEDIA_STOP;
		} else if ("MEDIA_PREV_TRACK".equalsIgnoreCase(key)) {
			rawCode = 0xB1;
			keyCode = NativeKeyEvent.VC_MEDIA_PREVIOUS;
		} else if ("MEDIA_NEXT_TRACK".equalsIgnoreCase(key)) {
			rawCode = 0xB0;
			keyCode = NativeKeyEvent.VC_MEDIA_NEXT;
		}
		
		GlobalScreen.postNativeEvent(new NativeKeyEvent(
				(pressed ? NativeKeyEvent.NATIVE_KEY_PRESSED : NativeKeyEvent.NATIVE_KEY_RELEASED),
				0,
				rawCode,
				keyCode,
				NativeKeyEvent.CHAR_UNDEFINED
				));
	}
}

class KBMMouseListener implements NativeMouseInputListener {
	public void nativeMouseClicked(NativeMouseEvent e) {
	}

	public void nativeMousePressed(NativeMouseEvent e) {
	}

	public void nativeMouseReleased(NativeMouseEvent e) {
		System.out.println("MOUSE_CLICK_EVENT " + e.getX() + "," + e.getY());
	}

	public void nativeMouseMoved(NativeMouseEvent e) {
	}

	public void nativeMouseDragged(NativeMouseEvent e) {
	}

	// KBMMouseListener() {
		
	// }
}

class KBMKeyboardListener implements NativeKeyListener {
	private boolean alt;
	private boolean shift;
	private boolean ctrl;
	private boolean meta;

	public void nativeKeyPressed(NativeKeyEvent e) {
		switch (e.getKeyCode()) {
			case NativeKeyEvent.VC_SHIFT: {
				shift = true;
				break;
			}
			case NativeKeyEvent.VC_CONTROL: {
				ctrl = true;
				break;
			}
			case NativeKeyEvent.VC_ALT: {
				alt = true;
				break;
			}
			case NativeKeyEvent.VC_META: {
				meta = true;
				break;
			}
			default: {
				ArrayList<String> multiKey = new ArrayList<String>();
				
				if (shift) {
					multiKey.add("SHIFT");
				}

				if (alt) {
					multiKey.add("ALT");
				}

				if (meta) {
					multiKey.add("META");
				}

				if (ctrl) {
					multiKey.add("CTRL");
				}

				StringBuilder sb = new StringBuilder();
				for (String s : multiKey)
				{
						sb.append(s) ;
						sb.append("+");
				}

				switch (e.getKeyCode()) {
					case NativeKeyEvent.VC_SPACE: {
						sb.append("SPACE");
						break;
					}
					case NativeKeyEvent.VC_BACKSPACE: {
						sb.append("BACKSPACE");
						break;
					}
					default: {
						sb.append(NativeKeyEvent.getKeyText(e.getKeyCode()));
					}
				}

				System.out.println("KEYBOARD_EVENT " + sb.toString());
			}
		}
		// System.out.println("KEY PRESS: " + NativeKeyEvent.getKeyText(e.getKeyCode()));
	}

	public void nativeKeyReleased(NativeKeyEvent e) {
		switch (e.getKeyCode()) {
			case NativeKeyEvent.VC_SHIFT: {
				shift = false;
				break;
			}
			case NativeKeyEvent.VC_CONTROL: {
				ctrl = false;
				break;
			}
			case NativeKeyEvent.VC_ALT: {
				alt = false;
				break;
			}
			case NativeKeyEvent.VC_META: {
				meta = false;
				break;
			}
		}
	}

	public void nativeKeyTyped(NativeKeyEvent e) {
		// System.out.println("Key Typed: " + e.getKeyText(e.getKeyCode()));
	}

	// KBMKeyboardListener() {

	// }
}
