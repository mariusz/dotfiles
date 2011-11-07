on run
  set info to ""
  tell application "System Events"
    set num to count (every process whose name is "Spotify")
  end tell
  if num > 0 then
    tell application "Spotify"
      if player state is playing then
        set who to artist of current track
        set what to name of current track
        set onwhat to album of current track
        set info to who & " - " & what 
      end if
    end tell
  end if
  return info
end run

