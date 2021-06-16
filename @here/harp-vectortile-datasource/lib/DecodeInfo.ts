/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    GeoBox,
    OrientedBox3,
    Projection,
    TileKey,
    TilingScheme,
    webMercatorTilingScheme
} from "@here/harp-geoutils";
import * as THREE from "three";

import { WorldTileProjectionCookie } from "./OmvUtils";

export class DecodeInfo {
    /**
     * The [[GeoBox]] of the Tile to decode.
     */
    readonly geoBox: GeoBox;

    readonly projectedBoundingBox = new OrientedBox3();

    /**
     * The tile bounds in the OMV tile space [[webMercatorTilingScheme]].
     */
    readonly tileBounds = new THREE.Box3();

    /**
     * The tile size in the OMV tile space [[webMercatorTilingScheme]].
     */
    readonly tileSize = new THREE.Vector3();

    /**
     * The center of the Tile in the target [[Projection]] space.
     * Geometries generated by decoding the OMV tile must be relative
     * to this position.
     */
    readonly center = new THREE.Vector3();

    /**
     * @internal
     */
    worldTileProjectionCookie?: WorldTileProjectionCookie;

    /**
     * Estimated tile size in pixels.
     */
    readonly tileSizeOnScreen: number;

    /**
     * The maximum number of columns.
     */
    readonly columnCount: number;

    /**
     * The maximum number of rows.
     */
    readonly rowCount: number;

    /**
     * Constructs a new [[DecodeInfo]].
     *
     * @param targetProjection - The [[Projection]]
     * @param tileKey - The [[TileKey]] of the Tile to decode.
     * @param storageLevelOffset - The storage level offset.
     */
    constructor(
        readonly targetProjection: Projection,
        readonly tileKey: TileKey,
        readonly storageLevelOffset: number = 0
    ) {
        this.geoBox = this.tilingScheme.getGeoBox(tileKey);
        this.targetProjection.projectBox(this.geoBox, this.projectedBoundingBox);
        this.projectedBoundingBox.getCenter(this.center);
        this.tilingScheme.getWorldBox(tileKey, this.tileBounds);
        this.tileBounds.getSize(this.tileSize);
        this.tileSizeOnScreen = 256 * Math.pow(2, -this.storageLevelOffset);

        this.columnCount = webMercatorTilingScheme.subdivisionScheme.getLevelDimensionX(
            this.tileKey.level
        );

        this.rowCount = webMercatorTilingScheme.subdivisionScheme.getLevelDimensionY(
            this.tileKey.level
        );
    }

    /**
     * The [[TilingScheme]] of the OMV data, currenly it is defined
     * to be [[webMercatorTilingScheme]].
     */
    get tilingScheme(): TilingScheme {
        return webMercatorTilingScheme;
    }

    /**
     * The [[Projection]] of OMV tiled data, currenly it is defined
     * to be [[webMercatorProjection]].
     */
    get sourceProjection(): Projection {
        return this.tilingScheme.projection;
    }
}
