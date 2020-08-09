<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'mysitewp_db' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'L[INmDMp@HjzN8jmnltf&5puPn6018kYLGHN^bt,!st&%W#T9R5N,E-rcwt+;X|{' );
define( 'SECURE_AUTH_KEY',  'JSBxM?cB)$)pZUuoSx{?[hR-HSt`%!tBRLD8.(GbaCD#]V7sv`k!%kqN>l])-D0e' );
define( 'LOGGED_IN_KEY',    '$p!Wr_K>bq<eDhd]`7;XO4#}U~f*yB:fmf bE_&L8X{E:a6.v,z5`1cXg<g}M(PX' );
define( 'NONCE_KEY',        '8ZFyIW[{4gbwwB8KxJp.aPx8811HTLVgN)35~tL}/:FdwTrK~*ZW (!L_Xy#5oV)' );
define( 'AUTH_SALT',        'WAD#iCF}eR%$dwx23`[!vNb)EOol~$05Ee0,?T0odU#;WWJ?`_6YkR@3jhswnKL2' );
define( 'SECURE_AUTH_SALT', 'o;ls,qz|O2991?5nw%OzF!NG,h@4H ~yTotkTO7B*eR+nczW:|fEfXT*xp%5D$mt' );
define( 'LOGGED_IN_SALT',   'T~w#agw|m|rQq&b)%JGA~9JGKhD=x`q*=}+TCYV(`&U(<A{A$m@ W/^xayMkyYj3' );
define( 'NONCE_SALT',       '*}@ &HBKfy[bFt(?)RcvR>W(u#1V]PfB)c+Xf)!R]ymoo$dbw*0(^6{]Hy>woz5 ' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
