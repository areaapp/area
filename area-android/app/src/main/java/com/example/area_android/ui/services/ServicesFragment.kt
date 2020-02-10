package com.example.area_android.ui.services

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.size
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.DropboxAuthActivity
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import kotlinx.android.synthetic.main.fragment_areas.*
import kotlinx.android.synthetic.main.fragment_services.*
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class ServicesFragment : Fragment() {

    private lateinit var servicesViewModel: ServicesViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        servicesViewModel =
            ViewModelProviders.of(this).get(ServicesViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_services, container, false)

        val app = this.activity!!.application as AreaApplication
        val url = app.serverUrl + "/me"
        Fuel.get(url)
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this.activity, "Connection to the server failed", Toast.LENGTH_LONG).show()
                    }
                    is Result.Success -> {
                        val obj = result.get().obj()
                        val data = obj.getJSONObject("data")
                    }
                }
            }

        root.findViewById<Button>(R.id.services_button)?.setOnClickListener {
            val url2 : String = app.serverUrl + "/services"
            Fuel.get(url2)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                        }
                        is Result.Success -> {
                            this.addServices(result.get().obj())
                        }
                    }
                }
        }

        return root
    }

    private fun addServices(obj: JSONObject) {
        val serviceButtonsLayout = view!!.findViewById<LinearLayout>(R.id.serviceButtonsLayout)
        serviceButtonsLayout.removeViewsInLayout(0, serviceButtonsLayout.size)

        val data: JSONArray = obj.getJSONArray("data")

        for (i in 0 until data.length()) {
            val service: JSONObject = data.getJSONObject(i)
            val icon = service.getString("iconName").replace('-', '_').toUpperCase()

            val d: Drawable =
                MaterialDrawableBuilder.with(context) // provide a context
                    .setIcon(MaterialDrawableBuilder.IconValue.valueOf(icon)) // provide an icon
                    .setColor(Color.WHITE) // set the icon color
                    .setToActionbarSize() // set the icon size
                    .build() // Finally call build

            val button = MaterialButton(context!!)
            button.text = service.getString("displayName")
            button.icon = d
            button.setOnClickListener {
                this.redirectToService(service.getString("name"))
            }

            serviceButtonsLayout.addView(button)
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.activity!!.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this.activity, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            this.activity!!.finish()
            return
        }


        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                val data = result.get().obj().getString("data")

                app.redirectAction = AreaApplication.ActionType.Signin
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
            }
    }
}