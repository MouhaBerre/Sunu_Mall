#!/usr/bin/env python
"""Point d'entrée Django pour les commandes en ligne de commande."""
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Impossible d'importer Django. Vérifie qu'il est bien installé "
            "et que ton environnement virtuel est activé."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
