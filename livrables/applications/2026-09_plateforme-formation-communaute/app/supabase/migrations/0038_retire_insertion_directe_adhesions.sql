-- Lot 3 (suite de la 0037) : la demande d'adhesion ne passe plus que par la fonction
-- demander_adhesion, qui impose les reponses aux questions de l'espace.
--
-- A APPLIQUER SEULEMENT UNE FOIS LE NOUVEAU CODE EN LIGNE. Tant que l'ancienne version de
-- l'application tourne, elle insere encore directement dans adhesions : cette migration ferait
-- echouer "Rejoindre la communaute" pour tout le monde.
--
-- Sans elle, un membre habile pourrait creer sa demande par un appel direct a l'API et contourner
-- les questions. Les administrateurs (service_role) ne sont pas concernes.

revoke insert on public.adhesions from authenticated;
