# FOTO · modelos de IA

Todos se ejecutan en el navegador con [onnxruntime-web](https://github.com/microsoft/onnxruntime) (MIT, en `foto/ort/`). Cada uno se descarga solo la primera vez que se usa y queda guardado en la caché del navegador (`ia-adposter-v1`).

| Archivo | Para qué | Origen | Licencia |
|---|---|---|---|
| `fondo-u2netp.onnx` | Quitar el fondo | U²-Net (u2netp) de Xuebin Qin y col., en la versión ONNX de rembg | Apache-2.0 |
| `borrar-migan.onnx` | Borrar un objeto y tapar arañazos | MI-GAN de Picsart AI Research (pipeline ONNX 512 Places2) | MIT |
| `ampliar-waifu2x.onnx` | Ampliar ×2 (foto, ruido suave) | waifu2x upconv_7 «photo» de nagadomi (nunif), exportado a ONNX | MIT |
| `ruido-waifu2x.onnx` | Quitar el grano | waifu2x vgg_7 «photo» de nagadomi (nunif), exportado a ONNX | MIT |
| `colorear-deoldify.onnx` | Colorear | DeOldify de Jason Antic (ONNX de instant-high/deoldify-onnx), con los pesos en int8 por canal (64 MB en vez de 254 MB) | MIT |

Los PSD se leen y se escriben con [ag-psd](https://github.com/Agamnentzar/ag-psd) (MIT, `foto/ag-psd.js`).

Las herramientas para exportar y reducir los modelos están en el proyecto AVHUB (`codigo/herramientas/`).
