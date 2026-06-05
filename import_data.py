import json
from supabase import create_client

SUPABASE_URL = "https://vygnakqeqdciripiyvib.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Z25ha3FlcWRjaXJpcGl5dmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjYzMjAsImV4cCI6MjA5NjIwMjMyMH0.vewDbD7MjYNyLUpOdn7Kwcs5k-mNfQX0LqQH2xZsayU"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. 디스코그래피 + 가사 + MV 합치기
with open("vaundy_discography.json", encoding="utf-8") as f:
    discography = json.load(f)

with open("vaundy_lyrics.json", encoding="utf-8") as f:
    lyrics_list = json.load(f)

with open("vaundy_mv_dates.json", encoding="utf-8") as f:
    mv_list = json.load(f)

# 가사 딕셔너리로 변환
lyrics_dict = {item["title"]: item for item in lyrics_list}

# MV 딕셔너리로 변환 (MUSIC VIDEO만)
mv_dict = {}
for mv in mv_list:
    if "MUSIC VIDEO" in mv["title"] and "TEASER" not in mv["title"] and "MAKING" not in mv["title"]:
        for title, lyric in lyrics_dict.items():
            if title in mv["title"]:
                mv_dict[title] = mv["youtube_url"]

songs = []
seen_db_ids = set()
for item in discography:
    release_date = item.get("release_date", "").replace("/", "-")
    if len(release_date) == 7:
        release_date += "-01"

    db_id = item.get("db_id")
    if db_id in seen_db_ids:
        db_id = None
    else:
        seen_db_ids.add(db_id)

    for song_title in item.get("songs", []):
        clean_title = song_title.split("(")[0].split("（")[0].strip()
        lyric_data = lyrics_dict.get(clean_title, {})

        songs.append({
            "db_id": db_id,
            "title": clean_title,
            "release_date": release_date or None,
            "category": item.get("category"),
            "album_name": item.get("title"),
            "album_cover_url": item.get("image_url"),
            "lyrics": lyric_data.get("lyrics"),
            "lyrics_url": lyric_data.get("url"),
            "youtube_url": mv_dict.get(clean_title) or item.get("links", {}).get("youtube"),
            "play_url": item.get("links", {}).get("play"),
        })

print(f"곡 {len(songs)}개 삽입 중...")
supabase.table("songs").insert(songs).execute()
print("songs 완료!")

# 2. 공연 데이터
# 2. 공연 데이터 (merge 버전)
with open("vaundy_live_merge_database.json", encoding="utf-8") as f:
    concerts_raw = json.load(f)

concerts = []
for item in concerts_raw:
    date_str = item.get("date", "")
    if date_str:
        date_str = date_str.split(" - ")[0].strip()
        date_str = date_str.replace("/", "-").strip()
        parts = date_str.split("-")
        try:
            if len(parts) == 3:
                date_str = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
            else:
                date_str = None
        except:
            date_str = None
    else:
        date_str = None

    setlist = item.get("setlist", [])
    setlist_text = "\n".join(setlist) if setlist else None

    concerts.append({
        "date": date_str,
        "category": item.get("category"),
        "title": item.get("title"),
        "status": item.get("status"),
        "venue": item.get("venue"),
        "venue_en": item.get("venue_en"),
        "location": item.get("location"),
        "full_address": item.get("full_address"),
        "memo": item.get("memo"),
        "is_archive": item.get("is_archive", True),
        "setlist": setlist_text,
        "is_setlist_available": item.get("is_setlist_available", False),
    })

print(f"공연 {len(concerts)}개 삽입 중...")
supabase.table("concerts").insert(concerts).execute()
print("concerts 완료!")

# 3. 협업 데이터
with open("vaundy_wiki_works_final.json", encoding="utf-8") as f:
    wiki = json.load(f)

collabs = []
for item in wiki.get("participated_works", []):
    date_str = item.get("date", "").replace("/", "-")
    artist = item.get("artist")
    if isinstance(artist, list):
        artist = ", ".join(artist)
    collabs.append({
        "date": date_str or None,
        "title": item.get("title"),
        "artist": artist,
        "album": item.get("album"),
        "type": "participated",
    })

for item in wiki.get("provided_works", []):
    date_str = item.get("date", "").replace("/", "-")
    artist = item.get("artist")
    if isinstance(artist, list):
        artist = ", ".join(artist)
    collabs.append({
        "date": date_str or None,
        "title": item.get("title"),
        "artist": artist,
        "type": "provided",
    })

print(f"협업 {len(collabs)}개 삽입 중...")
supabase.table("collaborations").insert(collabs).execute()
print("collaborations 완료!")

print("\n✅ 전체 완료!")