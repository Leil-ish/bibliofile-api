BEGIN;

TRUNCATE
  bibliofile_books,
  bibliofile_notes,
  bibliofile_users
  RESTART IDENTITY CASCADE;

INSERT INTO bibliofile_users (firstName, lastName, username, password)
VALUES
  ('Leila', 'Anderson', 'leilaanderson', '$2a$12$BjhpkMNzl9pwn5VwreBuwu6Wd03ENC5yrT/l1Mpcd9K3roaGA.iOi'),
  ('Matt', 'Anderson', 'mattanderson', '$2a$12$4WcGXxFbQvL8YT9buYGxMeRmsvKrxz98vS0hoOkgB8cuVOdFw4OHq'),
  ('Test', 'User', 'testuser', '$2a$12$nqKW/GNsv2TOlDgV9w1UfOZf3Zk2wLuHtXPqD8XENPLS7m8yiYUUq');

INSERT INTO bibliofile_books (title, authors, description, categories, imageLinks, isEbook, rating, borrowed, userId)  
VALUES
  ('Warbreaker', 'Brandon Sanderson', 'After bursting onto the fantasy scene with his acclaimed debut novel, Elantris, and following up with his blockbuster Mistborn trilogy, 
  Brandon Sanderson proves again that he is today''s leading master of what Tolkien called “secondary creation,” the invention of whole worlds, complete with magics and myths all their own. 
  Warbreaker is the story of two sisters, who happen to be princesses, the God King one of them has to marry, the lesser god who doesn''t like his job, and the immortal who''s still trying to 
  undo the mistakes he made hundreds of years ago. Their world is one in which those who die in glory return as gods to live confined to a pantheon in Hallandren''s capital city and where a 
  power known as BioChromatic magic is based on an essence known as breath that can only be collected one unit at a time from individual people. By using breath and drawing upon the color 
  in everyday objects, all manner of miracles and mischief can be accomplished. It will take considerable quantities of each to resolve all the challenges facing Vivenna and Siri, princesses of 
  Idris; Susebron the God King; Lightsong, reluctant god of bravery, and mysterious Vasher, the Warbreaker.', 'Fiction', 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  false, 5, false, 3),
  ('Skyward', 'Brandon Sanderson', 'From Brandon Sanderson, the #1 New York Times bestselling author of the Reckoners series, Words of Radiance, and the internationally bestselling Mistborn 
  series, comes the first book in an epic new series about a girl who dreams of becoming a pilot in a dangerous world at war for humanity''s future. Spensa''s world has been under attack for 
  decades. Now pilots are the heroes of what''s left of the human race, and becoming one has always been Spensa''s dream. Since she was a little girl, she has imagined soaring skyward and 
  proving her bravery. But her fate is intertwined with her father''s - a pilot himself who was killed years ago when he abruptly deserted his team, leaving Spensa''s chances of attending flight 
  school at slim to none. No one will let Spensa forget what her father did, yet fate works in mysterious ways. Flight school might be a long shot, but she is determined to fly. And an 
  accidental discovery in a long-forgotten cavern might just provide her with a way to claim the stars.', 'Fiction', 'http://books.google.com/books/content?id=sal2DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  false, 5, false, 1),
  ('The Way of Kings', 'Brandon Sanderson', 'Introduces the world of Roshar through the experiences of a war-weary royal compelled by visions, a highborn youth condemned to military slavery, 
  and a woman who is desperate to save her impoverished house.', 'Fiction', 'http://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  false, 5, false, 2),
  ('Oathbringer', 'Brandon Sanderson', 'The #1 New York Times bestselling sequel to Words of Radiance, from epic fantasy author Brandon Sanderson at the top of his game. In Oathbringer, the 
  third volume of the New York Times bestselling Stormlight Archive, humanity faces a new Desolation with the return of the Voidbringers, a foe with numbers as great as their thirst for vengeance. 
  Dalinar Kholin’s Alethi armies won a fleeting victory at a terrible cost: The enemy Parshendi summoned the violent Everstorm, which now sweeps the world with destruction, and in its passing awakens 
  the once peaceful and subservient parshmen to the horror of their millennia-long enslavement by humans. While on a desperate flight to warn his family of the threat, Kaladin Stormblessed must come 
  to grips with the fact that the newly kindled anger of the parshmen may be wholly justified. Nestled in the mountains high above the storms, in the tower city of Urithiru, Shallan Davar investigates 
  the wonders of the ancient stronghold of the Knights Radiant and unearths dark secrets lurking in its depths. And Dalinar realizes that his holy mission to unite his homeland of Alethkar was too narrow 
  in scope. Unless all the nations of Roshar can put aside Dalinar’s blood-soaked past and stand together—and unless Dalinar himself can confront that past—even the restoration of the Knights Radiant 
  will not prevent the end of civilization.', 'Fiction', 'http://books.google.com/books/content?id=VsT3DQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  false, 5, false, 1),
  ('Mistborn', 'Brandon Sanderson', 'From #1 New York Times bestselling author Brandon Sanderson, the Mistborn series is a heist story of political intrigue and magical, martial-arts action. For a 
  thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler, the \"Sliver of Infinity,\" reigned with 
  absolute power and ultimate terror, divinely invincible. Then, when hope was so long lost that not even its memory remained, a terribly scarred, heart-broken half-Skaa rediscovered it in the 
  depths of the Lord Ruler''s most hellish prison. Kelsier \"snapped\" and found in himself the powers of a Mistborn. A brilliant thief and natural leader, he turned his talents to the ultimate caper, 
  with the Lord Ruler himself as the mark. Kelsier recruited the underworld''s elite, the smartest and most trustworthy allomancers, each of whom shares one of his many powers, and all of whom 
  relish a high-stakes challenge. Only then does he reveal his ultimate dream, not just the greatest heist in history, but the downfall of the divine despot. But even with the best criminal crew 
  ever assembled, Kel''s plan looks more like the ultimate long shot, until luck brings a ragged girl named Vin into his life. Like him, she''s a half-Skaa orphan, but she''s lived a much harsher 
  life. Vin has learned to expect betrayal from everyone she meets, and gotten it. She will have to learn to trust, if Kel is to help her master powers of which she never dreamed. This saga dares 
  to ask a simple question: What if the hero of prophecy fails?', 'Fiction', 'http://books.google.com/books/content?id=t_ZYYXZq4RgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  false, 5, false, 3);

INSERT INTO bibliofile_notes (libraryId, userId, noteName, content) 
VALUES
  (1, 3, 'War broken.', 'Hey Siri.'),
  (2, 1, 'Mushrooms!', 'I think there is more here than meets the eye.'),
  (3, 2, 'The K of Wings', 'I like wings.'),
  (4, 1, 'Oath Brought', 'Pattern is still the best character.'),
  (5, 3, 'Born of the Mists', 'Lord Drooler, more like.');

COMMIT;
