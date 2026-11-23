# Entrada de imágenes

Sube aquí tus imágenes **dentro de una carpeta con el nombre de su destino** y ADPOSTER hace el resto:

```
entrada/msp-music/mi-poster.jpg      →  assets/msp-music/mi-poster.webp
entrada/ads-klub/oferta.png          →  assets/ads-klub/oferta.webp
entrada/fondos/mi-bar.png            →  assets/fondos/mi-bar.webp   (fondo de playlist, 1080 × 1920)
```

Al subirlas, se convierten solas a WebP de calidad alta para pantallas FHD en vertical, se borran de esta carpeta y se actualiza el índice.
Los displays recogen el contenido nuevo sin tocarlos, en menos de cinco minutos.

- Una carpeta que empieza por `ads-` es de **anuncios** (a pantalla completa); el resto son de **contenido** (pósteres dentro del marco).
- Para quitar una imagen, bórrala de `assets/<carpeta>/`.
- Formatos admitidos: JPG, PNG, WebP, AVIF, GIF, BMP y TIFF. Lo ideal: vertical, 1080 × 1920 o más.
